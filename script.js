// Sistema de Deeplinks para Condolivery
document.addEventListener('DOMContentLoaded', () => {
    // Função para detectar e processar deeplinks
    function handleDeeplinks() {
        // Verifica parâmetros de query (?product=ID ou ?seller=ID)
        const urlParams = new URLSearchParams(window.location.search);
        let productId = urlParams.get('product');
        let sellerId = urlParams.get('seller');
        
        // Verifica hash routing (#/product/ID ou #/seller/ID)
        const hash = window.location.hash;
        if (hash) {
            const hashMatch = hash.match(/#\/(product|seller)\/(.+)/);
            if (hashMatch) {
                const type = hashMatch[1];
                const id = hashMatch[2];
                
                if (type === 'product') {
                    productId = id;
                } else if (type === 'seller') {
                    sellerId = id;
                }
            }
        }
        
        if (productId) {
            // Redireciona para o app com deeplink de produto
            const deeplink = `condolivery://product=${productId}`;
            console.log('Redirecionando para produto:', deeplink);
            
            // Tenta abrir o app
            window.location.href = deeplink;
            
            // Fallback: se o app não abrir em 2 segundos, mostra instruções
            setTimeout(() => {
                showAppDownloadMessage('produto');
            }, 2000);
            
        } else if (sellerId) {
            // Redireciona para o app com deeplink de vendedor
            const deeplink = `condolivery://seller=${sellerId}`;
            console.log('Redirecionando para vendedor:', deeplink);
            
            // Tenta abrir o app
            window.location.href = deeplink;
            
            // Fallback: se o app não abrir em 2 segundos, mostra instruções
            setTimeout(() => {
                showAppDownloadMessage('vendedor');
            }, 2000);
        }
    }
    
    // Função para mostrar mensagem de download do app
    function showAppDownloadMessage(tipo) {
        // Cria um modal para instruir o usuário
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        modalContent.innerHTML = `
            <h3 style="color: #333; margin-bottom: 20px;">App Condolivery não encontrado</h3>
            <p style="color: #666; margin-bottom: 25px;">
                Para visualizar este ${tipo}, você precisa ter o app Condolivery instalado.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 20px;">
                <a href="https://play.google.com/store" target="_blank" style="text-decoration: none;">
                    <img src="img/downloadapp/storeandroid.png" alt="Android" style="height: 50px;">
                </a>
                <a href="https://apps.apple.com/br/app/condolivery/id6526464037" target="_blank" style="text-decoration: none;">
                    <img src="img/downloadapp/appleDownload.png" alt="iOS" style="height: 50px;">
                </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Fechar
            </button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    
    // Executa a verificação de deeplinks
    handleDeeplinks();
    
    // Também executa quando o hash muda (para SPAs)
    window.addEventListener('hashchange', handleDeeplinks);

    // Botão de rolar para o topo
    const scrollToTopButton = document.getElementById('scroll-to-top');

    // Verifica se o botão existe
    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopButton.style.display = 'flex';
            } else {
                scrollToTopButton.style.display = 'none';
            }
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Adiciona rolagem suave
            });
        });
    } else {
        console.error('Botão "scroll-to-top" não encontrado no DOM.');
    }

    // Nenhuma lógica adicional necessária para a seção demonstra em formato de grade.
    
    const carousel = document.querySelector('.carousel-images');
    const images = document.querySelectorAll('.carousel-images img');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100; // Move apenas uma imagem por vez
        carousel.style.transform = `translateX(${offset}%)`;
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    // Corrige o tamanho do container para evitar problemas de largura
    carousel.style.width = '100%'; // Mantém o tamanho do container fixo

    // Adiciona lógica para transformar as imagens em um carrossel funcional em dispositivos móveis
    const heroImageContainer = document.querySelector('.hero-image');
    const heroImages = document.querySelectorAll('.hero-image img');

    if (window.innerWidth <= 768) {
        // Configura o carrossel para dispositivos móveis
        let startX = 0;
        let scrollLeft = 0;

        heroImageContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = heroImageContainer.scrollLeft;
        });

        heroImageContainer.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            const walk = startX - x; // Distância percorrida
            heroImageContainer.scrollLeft = scrollLeft + walk;
        });
    }
});
