﻿CREATE PROC FI_SP_PesqBeneficiario
	@IDCLIENTE BIGINT
AS
BEGIN
	IF(ISNULL(@IDCLIENTE,0) = 0)
		SELECT ID, CPF, NOME, IDCLIENTE ID FROM BENEFICIARIOS WITH(NOLOCK)
	ELSE
		SELECT ID, CPF, NOME, IDCLIENTE FROM BENEFICIARIOS WITH(NOLOCK) WHERE IDCLIENTE = @IDCLIENTE
END