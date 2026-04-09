const form = document.getElementById("cursoForm");
const resultado = document.getElementById("resultado");
const btnImagem = document.getElementById("btnImagem");

const selectPrereq = document.getElementById("temPrerequisito");
const prereqContainer = document.getElementById("prerequisitoContainer");
const boxPrereq = document.getElementById("boxPrerequisito");

// NOVO: checkbox de deslocamento
const deslocamentoToggle = document.getElementById("ativarDeslocamento");
const boxDeslocamento = document.getElementById("boxDeslocamento");

selectPrereq.addEventListener("change", () => {
    if (selectPrereq.value === "sim") {
        prereqContainer.classList.remove("hidden");
    } else {
        prereqContainer.classList.add("hidden");
        document.getElementById("prerequisitoCurso").value = "";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // ✅ Verificação obrigatória de pré-requisitos
    if (selectPrereq.value === "sim") {
        const prerequisitoObrigatorio = value("prerequisitoCurso").trim();
        if (!prerequisitoObrigatorio) {
            alert("Por favor, informe os pré‑requisitos para participação no curso.");
            document.getElementById("prerequisitoCurso").focus();
            return; // interrompe o envio
        }
    }

    const curso = value("nomeCurso");
    const data = value("dataCurso");
    const horario = value("horarioCurso");
    const local = value("localCurso");
    const prerequisito = value("prerequisitoCurso");
    const deslocamentoAtivo = deslocamentoToggle.checked;

    text("cursoTitulo", curso);
    text("cursoData", data);
    text("cursoHorario", horario);
    text("cursoLocal", local);

    if (selectPrereq.value === "sim" && prerequisito.trim()) {
        text("cursoPrerequisito", prerequisito);
        boxPrereq.classList.remove("hidden");
    } else {
        boxPrereq.classList.add("hidden");
    }

    // Mostrar ou ocultar seção de deslocamento
    if (deslocamentoAtivo) {
        boxDeslocamento.classList.remove("hidden");
    } else {
        boxDeslocamento.classList.add("hidden");
    }

    gerarEmail(curso, data, horario, local, prerequisito, deslocamentoAtivo);
    gerarDescricao(curso, data, horario, local, prerequisito, deslocamentoAtivo);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

btnImagem.addEventListener("click", () => {
    const cartaoElemento = document.getElementById("cartao");
    
    // Captura a cor exata que o usuário está vendo na tela no momento
    const corDeFundoAtual = window.getComputedStyle(cartaoElemento).backgroundColor;

    html2canvas(cartaoElemento, {
        scale: 2,
        backgroundColor: corDeFundoAtual // Usa a cor dinâmica em vez de uma fixa
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "cartao-confirmacao.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
    });
});

function gerarEmail(curso, data, horario, local, prereq) {
    const bloco = prereq ? `\n📌 Pré‑requisitos: ${prereq}\n` : "";

    document.getElementById("emailCorpo").value = `
Confirmação de participação no curso ${curso} - ${data}

`.trim();
}

function gerarDescricao(curso, data, horario, local, prereq, deslocamentoAtivo) {
    const blocoPrereq = prereq ? `\n\n📌Pré-requisitos: ${prereq}.` : "";
    const blocoDeslocamento = deslocamentoAtivo ? `
Para os participantes que informaram previamente a necessidade de hospedagem:
- A reserva será efetuada por esta Gepes e enviada por e-mail aos participantes.
Deslocamento Terrestre:
- O deslocamento terrestre deverá ocorrer em dia útil e dentro da jornada de trabalho.
- Verbas para viagem corporativa conforme IN-377-1 item 6.9.
- Prefixo para débito das despesas: 8677 – DIPES.
` : "";

    document.getElementById("descricaoImagem").value = `
Olá!

Sua participação no curso "${curso}" está confirmada.

📅 Data: ${data}
⏰ Horário: ${horario}
📍 Local: ${local}${blocoPrereq}

#Paratodosverem
Card digital de confirmação de curso com as instruções.
${blocoDeslocamento}
Situação FIP/ Ponto Eletrônico: 27X, onde X é o número de horas de treinamento no dia.
Obrigatório o uso de crachá e orientamos levar seu copo para consumo de café e garrafa ou copo para consumo de água.
Ausências sem justificativa serão tratadas como Desvio de Comportamento, nos termos da IN 383-1, item 4.

Atenciosamente,

Gepes Especializada Belo Horizonte
`.trim();
}

function value(id) {
    return document.getElementById(id).value;
}

function text(id, value) {
    document.getElementById(id).textContent = value;
}

const btnCopiarEmail = document.getElementById("btnCopiarEmail");

btnCopiarEmail.addEventListener("click", () => {
    const emailTexto = document.getElementById("descricaoImagem").value;
    navigator.clipboard.writeText(emailTexto).then(() => {
        alert("Texto do e-mail copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
    });
});

const btnAlterarCor = document.getElementById("btnAlterarCor");
const cartao = document.getElementById("cartao");

const cores = [
    "linear-gradient(160deg, #2c3e50, #000000)", // Grafite
    "linear-gradient(160deg, #102a43, #243b55)", // Marinho
    "linear-gradient(160deg, #0d324d, #1c1c1c)", // Petróleo
    "linear-gradient(160deg, #bdc3c7, #2c3e50)"  // Prata/Escuro
];

let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

// INPUT COLOR PARA PERSONALIZAÇÃO
const colorPicker = document.getElementById("colorPicker");

colorPicker.addEventListener("input", () => {
    const corEscolhida = colorPicker.value;
    cartao.style.background = corEscolhida;
});

const btnCompartilharEmail = document.getElementById("btnCompartilharEmail");

btnCompartilharEmail.addEventListener("click", () => {
    const cartaoElemento = document.getElementById("cartao");

    html2canvas(cartaoElemento, { scale: 2 }).then(canvas => {
        // Copia a imagem para a área de transferência
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(() => {
                // Pega o título e o texto já gerados
                const tituloEmail = document.getElementById("emailCorpo").value || "Confirmação de participação no curso";
                const corpoEmail = document.getElementById("descricaoImagem").value;

                // Abre o cliente de e-mail com título e corpo preenchidos
                const assunto = encodeURIComponent(tituloEmail);
                const corpo = encodeURIComponent(corpoEmail);
                window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
            }).catch(err => {
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente. Ela pode ser salva manualmente.");
            });
        });
    });
});
