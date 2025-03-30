CREATE PROC FI_SP_AltBeneficiario
	@Id            BIGINT,
	@CPF		   VARCHAR (11),
    @NOME          VARCHAR (50),
	@IdCliente	   BIGINT
AS
BEGIN
	UPDATE BENEFICIARIOS 
	SET 
		NOME = @NOME, 
		CPF = @CPF,
		IdCliente = @IdCliente
	WHERE Id = @Id
END