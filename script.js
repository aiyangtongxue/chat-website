document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子效果
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#64ffda'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#64ffda',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        }
    });

    // 初始化 GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero部分动画
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    // 特性部分动画
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });

        // 基础动画
        tl.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -100 : 100,
            duration: 1,
            ease: 'power3.out'
        });

        // 解锁动画
        if (item.querySelector('.unlock-animation')) {
            const unlockAnim = item.querySelector('.unlock-animation');
            
            ScrollTrigger.create({
                trigger: unlockAnim,
                start: 'top center',
                onEnter: () => {
                    const progressBar = unlockAnim.querySelector('.progress-bar');
                    const progressText = unlockAnim.querySelector('.progress-text span');
                    const locked = unlockAnim.querySelector('.locked');
                    const unlocked = unlockAnim.querySelector('.unlocked');
                    const scanningLine = unlockAnim.querySelector('.scanning-line');

                    // 扫描线动画
                    gsap.to(scanningLine, {
                        opacity: 0.5,
                        top: '100%',
                        duration: 1.5,
                        ease: 'none',
                        repeat: -1
                    });

                    // 进度条动画
                    gsap.to(progressBar, {
                        width: '100%',
                        duration: 2,
                        ease: 'power2.inOut',
                        onUpdate: function() {
                            const progress = Math.round(this.progress() * 100);
                            progressText.textContent = `${progress}%`;
                            
                            if (progress > 90) {
                                locked.style.opacity = '0';
                                unlocked.style.opacity = '1';
                            }
                        }
                    });
                },
                onLeaveBack: () => {
                    gsap.killTweensOf(unlockAnim.querySelector('.scanning-line'));
                    gsap.killTweensOf(unlockAnim.querySelector('.progress-bar'));
                    unlockAnim.querySelector('.locked').style.opacity = '1';
                    unlockAnim.querySelector('.unlocked').style.opacity = '0';
                    unlockAnim.querySelector('.progress-bar').style.width = '0';
                    unlockAnim.querySelector('.progress-text span').textContent = '0%';
                }
            });
        }

        // 成功动画
        if (item.querySelector('.success-animation')) {
            const successAnim = item.querySelector('.success-animation');
            const fileIcons = successAnim.querySelectorAll('.file-icon');
            
            fileIcons.forEach((icon, i) => {
                tl.from(icon, {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    delay: i * 0.2
                }, '-=0.3');
            });
        }
    });

    // 处理下载按钮点击事件
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
});

// 监听滚动事件，显示页面进度
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
});

// 页面元素淡入效果
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-fade-in').forEach(el => {
    observer.observe(el);
});

// 图片加载效果
document.querySelectorAll('.step-image img').forEach(img => {
    img.classList.add('loading');
    img.onload = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
    };
});

// FAQ交互
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // 关闭其他打开的FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 如果当前项未打开，则打开它
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// 添加下载处理函数
function handleDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const progressSpan = downloadBtn.querySelector('.download-progress');
    const buttonText = downloadBtn.querySelector('span:not(.download-progress)');
    
    // 禁用按钮，显示加载状态
    downloadBtn.disabled = true;
    buttonText.textContent = '准备下载...';
    
    // 文件URL - 确保这是正确的路径
    const fileUrl = './unlocker-setup.exe';
    
    // 创建一个 XMLHttpRequest 来处理下载
    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl, true);
    xhr.responseType = 'blob';
    
    xhr.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressSpan.textContent = ` ${percentComplete}%`;
        }
    };
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            // 创建 Blob URL
            const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            
            // 创建临时下载链接
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'IObit-Unlocker-Setup.exe';
            document.body.appendChild(a);
            
            // 触发下载
            a.click();
            
            // 清理
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // 重置按钮状态
            downloadBtn.disabled = false;
            buttonText.textContent = '免费下载';
            progressSpan.textContent = '';
        } else {
            handleDownloadError();
        }
    };
    
    xhr.onerror = handleDownloadError;
    
    // 开始下载
    try {
        xhr.send();
    } catch (error) {
        handleDownloadError();
    }
}

function handleDownloadError() {
    const downloadBtn = document.getElementById('downloadBtn');
    const buttonText = downloadBtn.querySelector('span:not(.download-progress)');
    const progressSpan = downloadBtn.querySelector('.download-progress');
    
    downloadBtn.disabled = false;
    buttonText.textContent = '下载失败，请重试';
    progressSpan.textContent = '';
    
    // 3秒后重置按钮文本
    setTimeout(() => {
        buttonText.textContent = '免费下载';
    }, 3000);
} 