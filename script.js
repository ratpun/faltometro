document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    const statusData = {
        '0': {
            cardClass: 'status-0',
            borderClass: 'status-0',
            message: 'Tudo certo por aqui! Nenhuma falta registrada. Continue assim!',
            image: '0.png'
        },
        '1': {
            cardClass: 'status-1-3',
            borderClass: 'status-1-3',
            message: 'Primeira falta registrada. Acontece! Apenas mantenha o foco.',
            image: '1.png'
        },
        '2': {
            cardClass: 'status-1-3',
            borderClass: 'status-1-3',
            message: 'Segunda falta. Ainda tranquilo, mas vamos evitar que vire um hábito.',
            image: '2.png'
        },
        '3': {
            cardClass: 'status-1-3',
            borderClass: 'status-1-3',
            message: 'Três faltas. Metade do caminho para a zona de perigo. Cuidado.',
            image: '3.png'
        },
        '4': {
            cardClass: 'status-4-5',
            borderClass: 'status-4-5',
            message: 'Quatro faltas. SINAL AMARELO! A partir de agora, cada falta conta muito.',
            image: '4.png'
        },
        '5': {
            cardClass: 'status-4-5',
            borderClass: 'status-4-5',
            message: 'Você está na corda bamba. A próxima falta pode ser crítica.',
            image: '5.png'
        },
        '6': {
            cardClass: 'status-6',
            borderClass: 'status-6',
            message: 'SEIS FALTAS! PERIGO MÁXIMO! Mais duas e é reprovação na certa.',
            image: '6.png'
        },
        '7': {
            cardClass: 'status-7',
            borderClass: 'status-7',
            message: 'Você está a uma falta da reprovação. CUIDADO EXTREMO!',
            image: '7.png'
        },
        '8': {
            cardClass: 'status-7',
            borderClass: 'status-7',
            message: 'Limite de faltas excedido. A situação é irreversível. Foco no próximo semestre.',
            image: '8.png'
        }
    };

    const materiasContainer = document.getElementById('materiasContainer');
    const addMateriaBtn = document.getElementById('addMateriaBtn');
    const materiaInput = document.getElementById('materiaInput');
    const defeatOverlay = document.getElementById('defeat-overlay');
    const defeatVideo = document.getElementById('defeat-video');
    const acceptDefeatBtn = document.getElementById('accept-defeat-btn');
    const fireworksContainer = document.getElementById('fireworks-container');
    let fireworksInterval = null; // Variável para controlar o loop dos fogos

    // --- Local Storage Functions ---
    function getMateriasFromStorage() {
        const materias = localStorage.getItem('materias');
        try {
            const parsed = JSON.parse(materias);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveMateriasToStorage(materias) {
        localStorage.setItem('materias', JSON.stringify(materias));
    }

    // --- Core Functions ---

    function loadMaterias() {
        materiasContainer.innerHTML = '';
        const materias = getMateriasFromStorage();
        materias.forEach(materia => addMateriaToDOM(materia));
    }

    function addMateriaToDOM(materia) {
        const template = document.getElementById('materiaTemplate');
        const clone = template.content.cloneNode(true);
        const materiaCard = clone.querySelector('.materia-card');
        const materiaHeader = clone.querySelector('.materia-header');
        const materiaDetails = clone.querySelector('.materia-details');

        materiaCard.setAttribute('data-id', materia.id);
        
        clone.querySelector('.materia-nome').textContent = materia.nome;
        clone.querySelector('.contador').textContent = materia.faltas;
        
        // --- Event Listeners para o card ---
        materiaHeader.addEventListener('click', () => {
            materiaDetails.classList.toggle('expanded');
        });

        const handleButtonClick = (e, callback) => {
            e.stopPropagation(); // Impede que o clique no botão expanda/recolha o card
            callback();
        };

        clone.querySelector('.increment-btn').addEventListener('click', (e) => handleButtonClick(e, () => handleFaltaChange(materia.id, 1)));
        clone.querySelector('.decrement-btn').addEventListener('click', (e) => handleButtonClick(e, () => handleFaltaChange(materia.id, -1)));
        clone.querySelector('.delete-btn').addEventListener('click', (e) => handleButtonClick(e, () => deleteMateria(materia.id)));
        
        materiasContainer.appendChild(clone);
        updateMateriaUI(materia.id, materia); // Aplica o status visual inicial
        feather.replace();
    }

    function handleFaltaChange(materiaId, change) {
        let materias = getMateriasFromStorage();
        const materiaIndex = materias.findIndex(m => m.id === materiaId);

        if (materiaIndex > -1) {
            const newCount = materias[materiaIndex].faltas + change;
            if (newCount >= 0) {
                // Checa a condição de derrota antes de salvar os dados
                if (newCount === 8 && change > 0) {
                    showDefeatScreen();
                }

                materias[materiaIndex].faltas = newCount;
                if (change > 0) {
                    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    materias[materiaIndex].datas.push(today);
                } else if (materias[materiaIndex].datas.length > 0) {
                     materias[materiaIndex].datas.pop();
                }
                saveMateriasToStorage(materias);
                updateMateriaUI(materiaId, materias[materiaIndex]);
            }
        }
    }
    
    function deleteMateria(materiaId) {
        let materias = getMateriasFromStorage();
        materias = materias.filter(m => m.id !== materiaId);
        saveMateriasToStorage(materias);

        const cardToRemove = document.querySelector(`.materia-card[data-id='${materiaId}']`);
        if (cardToRemove) {
            cardToRemove.style.opacity = '0';
            cardToRemove.style.transform = 'scale(0.9)';
            setTimeout(() => cardToRemove.remove(), 300);
        }
    }

    function createNewMateria() {
        const materiaNome = materiaInput.value.trim();
        if (materiaNome) {
            const novaMateria = {
                id: Date.now(),
                nome: materiaNome,
                faltas: 0,
                datas: []
            };

            const materias = getMateriasFromStorage();
            materias.push(novaMateria);
            saveMateriasToStorage(materias);
            
            addMateriaToDOM(novaMateria);
            materiaInput.value = '';
            materiaInput.focus();
        }
    }

    // --- UI Update Functions ---
    function updateMateriaUI(materiaId, materia) {
        const card = document.querySelector(`.materia-card[data-id='${materiaId}']`);
        if (!card) return;

        card.querySelector('.contador').textContent = materia.faltas;

        updateStatus(materia.faltas, card);
        updateDatasList(materia.datas, card);
    }
    
    function updateStatus(count, cardElement) {
        const statusContent = cardElement.querySelector('.status-content');
        const statusImage = cardElement.querySelector('.status-image');
        const statusMessage = cardElement.querySelector('.status-message');

        const statusKey = count >= 8 ? '8' : count.toString();
        const status = statusData[statusKey];
        
        if (!status) return;

        cardElement.classList.remove('status-0', 'status-1-3', 'status-4-5', 'status-6', 'status-7');
        cardElement.classList.add(status.cardClass);

        statusContent.classList.remove('hidden', 'status-0', 'status-1-3', 'status-4-5', 'status-6', 'status-7');
        statusContent.classList.add(status.borderClass);
        statusImage.src = "images/" + status.image;
        statusMessage.textContent = status.message;
    }

    function updateDatasList(datas, cardElement) {
        const listElement = cardElement.querySelector('.datas-faltas-list');
        const containerElement = cardElement.querySelector('.datas-faltas-container');
        
        listElement.innerHTML = '';
        if (datas.length > 0) {
            [...datas].reverse().forEach(data => {
                const li = document.createElement('li');
                li.textContent = `Falta em: ${data}`;
                listElement.appendChild(li);
            });
            containerElement.classList.remove('hidden');
        } else {
            containerElement.classList.add('hidden');
        }
    }

    // --- Defeat Screen Functions ---
    function showDefeatScreen() {
        // Adiciona as classes para iniciar as animações
        defeatVideo.classList.add('video-enter-active');
        acceptDefeatBtn.classList.add('button-enter-active');

        defeatVideo.src = "video.mp4";
        defeatVideo.play();
        defeatOverlay.classList.remove('hidden');
        
        if (fireworksInterval) clearInterval(fireworksInterval);
        fireworksContainer.innerHTML = ''; // Limpa fogos anteriores
        createFireworks(30); // Rajada inicial
        fireworksInterval = setInterval(() => createFireworks(30), 2500); // Inicia o loop
    }

    function hideDefeatScreen() {
        defeatOverlay.classList.add('hidden');
        
        // Remove as classes de animação para resetar o estado
        defeatVideo.classList.remove('video-enter-active');
        acceptDefeatBtn.classList.remove('button-enter-active');
        
        if (fireworksInterval) {
            clearInterval(fireworksInterval); // Para o loop
            fireworksInterval = null;
        }
        
        // Aguarda a transição de fade-out do overlay antes de limpar
        setTimeout(() => {
            fireworksContainer.innerHTML = '';
            defeatVideo.pause();
            defeatVideo.src = "";
        }, 500);
    }

    function createFireworks(count) {
        const colors = ['#FFD700', '#FF4500', '#ADFF2F', '#00FFFF', '#FF1493', '#FFFFFF'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                firework.style.left = `${x}px`;
                firework.style.top = `${y}px`;

                const particleCount = Math.floor(Math.random() * 20) + 30;
                
                for (let j = 0; j < particleCount; j++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.backgroundColor = color;
                    particle.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
                    
                    firework.appendChild(particle);

                    const angle = Math.random() * 360;
                    const distance = Math.random() * 120 + 80;
                    
                    setTimeout(() => {
                        const tx = Math.cos(angle * Math.PI / 180) * distance;
                        const ty = Math.sin(angle * Math.PI / 180) * distance;
                        particle.style.transform = `translate(${tx}px, ${ty}px)`;
                        particle.style.opacity = '0';
                    }, 10);
                }

                fireworksContainer.appendChild(firework);
                setTimeout(() => firework.remove(), 1300);

            }, Math.random() * 1500);
        }
    }

    // --- Initial Setup & Event Listeners ---
    addMateriaBtn.addEventListener('click', createNewMateria);
    materiaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createNewMateria();
        }
    });
    acceptDefeatBtn.addEventListener('click', hideDefeatScreen);

    loadMaterias();
});