
$(document).ready(function () {
    $('.cpf-mask').on('blur', function () {
        let value = $(this).val();
        value = value.replace(/\D/g, '');

        if (value.length === 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        $(this).val(value);
    });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const cpf = $(this).find("#CPF").val();

        if (!ValidarCPF(cpf)) {
            ModalDialog("Erro", "CPF inválido!");
            return; 
        }
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),

            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success: function (r) {
                var retorno = JSON.parse(r);
                if (retorno.Mensagem == null)
                    retorno.Mensagem = "Cadastrado com sucesso";
                ModalDialog("Sucesso", retorno.Mensagem);
                $("formCadastro")[0].reset();
                return true;
            }

        });
    })

})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

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