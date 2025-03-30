// Variáveis para armazenar os dados
let angulos = [];
let valoresCampo = [];
let valoresPotencia = [];
let valoresPotenciaDb = [];

// Função para calcular a diretividade e os gráficos
function calcularDiretividade() {
    let padrao = document.getElementById("padrao").value; // Expressão para o padrão de radiação

    try {
        // Verifica se a expressão é válida
        math.evaluate(padrao, { theta: 1, phi: 1 });
        let f = (theta, phi) => math.evaluate(padrao, { theta, phi });

        let nTheta = 100;
        let dTheta = Math.PI / nTheta;

        // Calculando o valor máximo de F(teta)
        let Fmax = 0;
        for (let i = 0; i <= nTheta; i++) {
            let theta = i * dTheta;
            let F_value = Math.abs(f(theta, 0));
            if (F_value > Fmax) Fmax = F_value;
        }

        // Calculando a integral de F(teta) * sin(teta)
        let integral = 0;
        for (let i = 0; i <= nTheta; i++) {
            let theta = i * dTheta;
            let F_value = Math.abs(f(theta, 0));
            integral += F_value * Math.sin(theta) * dTheta;
        }

        // Calculando a Diretividade usando a fórmula fornecida
        let D = (4 * Math.PI) / (integral / Fmax);
        let anguloFeixe = 50 / Math.sqrt(D); // Aproximação para o ângulo de feixe principal

        document.getElementById("resultado").innerHTML = `
            Diretividade Máxima: ${D.toFixed(4)}<br>
            Ângulo de Feixe Principal: ${anguloFeixe.toFixed(2)}°
        `;

        // Calculando os valores para os gráficos
        calcularValores(padrao);

        // Desenhando o gráfico inicial (campo)
        desenharGrafico("campo"); // Exibindo inicialmente o gráfico de campo
    } catch (error) {
        document.getElementById("resultado").innerHTML = "Erro: Verifique a expressão inserida no padrão de radiação.";
    }
}

// Função para calcular os valores para os gráficos
function calcularValores(padrao) {
    angulos = [];
    valoresCampo = [];
    valoresPotencia = [];
    valoresPotenciaDb = [];

    try {
        // Calculando os valores para o gráfico
        for (let theta = 0; theta <= Math.PI; theta += Math.PI / 50) {
            angulos.push(theta * (180 / Math.PI)); // Convertendo para graus
            let campo = math.evaluate(padrao, { theta, phi: 0 });
            let potencia = Math.pow(Math.abs(campo), 2);
            let potenciaDb = 10 * Math.log10(potencia);

            valoresCampo.push(campo);
            valoresPotencia.push(potencia);
            valoresPotenciaDb.push(potenciaDb);
        }
    } catch (error) {
        document.getElementById("resultado").innerHTML = "Erro ao processar a função. Verifique a sintaxe.";
    }
}

// Função para desenhar o gráfico com base no tipo selecionado
function desenharGrafico(tipoGrafico) {
    let ctx = document.getElementById("grafico").getContext("2d");

    // Remove o gráfico anterior
    if (window.myChart) window.myChart.destroy();

    // Gerando o gráfico com o tipo escolhido
    if (tipoGrafico === "campo") {
        window.myChart = new Chart(ctx, {
            type: "line", // Usando gráfico de linha
            data: {
                labels: angulos.map(a => `${a.toFixed(1)}°`),
                datasets: [{
                    label: "Campo de Radiação",
                    data: valoresCampo,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1 // Para deixar a linha mais suave
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 0, // Garantindo que o gráfico começa de 0
                        max: Math.max(...valoresCampo) * 1.1 // Ajustando o limite de intensidade
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ângulo (°)'
                        }
                    }
                }
            }
        });
    } else if (tipoGrafico === "potencia") {
        window.myChart = new Chart(ctx, {
            type: "line", // Usando gráfico de linha
            data: {
                labels: angulos.map(a => `${a.toFixed(1)}°`),
                datasets: [{
                    label: "Potência Radiada",
                    data: valoresPotencia,
                    borderColor: "green",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 0,
                        max: Math.max(...valoresPotencia) * 1.1
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ângulo (°)'
                        }
                    }
                }
            }
        });
    } else if (tipoGrafico === "potenciaDb") {
        window.myChart = new Chart(ctx, {
            type: "line", // Usando gráfico de linha
            data: {
                labels: angulos.map(a => `${a.toFixed(1)}°`),
                datasets: [{
                    label: "Potência em dB",
                    data: valoresPotenciaDb,
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 0,
                        max: Math.max(...valoresPotenciaDb) * 1.1
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ângulo (°)'
                        }
                    }
                }
            }
        });
    }
}

// Adiciona evento para mudar o gráfico quando o tipo de gráfico for alterado
document.querySelectorAll('input[name="graficoTipo"]').forEach(radio => {
    radio.addEventListener("change", (event) => {
        let tipoSelecionado = event.target.value;
        desenharGrafico(tipoSelecionado); // Atualiza o gráfico conforme a seleção
    });
});