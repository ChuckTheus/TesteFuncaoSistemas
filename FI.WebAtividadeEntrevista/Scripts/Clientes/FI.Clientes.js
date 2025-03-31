$(document).ready(function () {
    $('.cpf-mask').on('blur', function () {
        let value = $(this).val();
        value = value.replace(/\D/g, '');

        if (value.length === 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        $(this).val(value);
    });

    $('#beneficiarios').on('click', function () {
        const clienteId = $('#clienteId').val(); 

        $.ajax({
            url: '/Beneficiario/BeneficiarioList',
            type: 'POST',
            data: {
                idCliente: clienteId,
                Nome: $('#Nome').val(),
                CPF: $('#CPF').val(),
            },
            success: function (response) {
                alert('Sucesso: ' + response);
                window.location.href = urlRetorno; 
            },
            error: function (response) {
                alert('Erro: ' + response.responseText);
            }
        });
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const cpf = $(this).find("#CPF").val();
        const cep = $(this).find("#CEP").val();
        const telefone = $(this).find("#Telefone").val();

        if (!ValidarCPF(cpf)) {
            ModalDialog("Erro", "CPF inválido!");
            return; 
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": cep.replace(/[^\d]+/g, ''),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": telefone.replace(/[^\d]+/g, ''),
                "CPF": $(this).find("#CPF").val(),
            },
            error: function (r) {
                if (r.status === 400) {
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                } else if (r.status === 500) {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                }
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
            }
        });
    });
});

function ValidarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    const validarDigito = (base, multiplicadorInicial) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base.charAt(i)) * (multiplicadorInicial - i);
        }
        let digitoVerificador = (soma * 10) % 11;
        if (digitoVerificador === 10 || digitoVerificador === 11) {
            digitoVerificador = 0;
        }
        return digitoVerificador;
    };

    const primeiroDigitoVerificador = validarDigito(cpf.substring(0, 9), 10);
    const segundoDigitoVerificador = validarDigito(cpf.substring(0, 10), 11);

    return primeiroDigitoVerificador === parseInt(cpf.charAt(9)) &&
        segundoDigitoVerificador === parseInt(cpf.charAt(10));
}
