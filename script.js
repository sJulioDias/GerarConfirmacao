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
    html2canvas(document.getElementById("cartao"), {
        scale: 2,
        backgroundColor: "#062f4f"
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
    "linear-gradient(160deg, #062f4f, #04324f)", // padrão
    "linear-gradient(160deg, #4f0630, #6a0432)", // vinho
    "linear-gradient(160deg, #064f2f, #046a32)", // verde
    "linear-gradient(160deg, #4f4606, #6a5a04)"  // dourado
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
