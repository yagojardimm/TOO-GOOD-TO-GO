export interface EnderecoCepResult {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoCepResult> {
  const cleanCep = (cep || '').replace(/\D/g, '').slice(0, 8);

  if (cleanCep.length !== 8) {
    throw new Error('Informe um CEP válido com 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

  if (!response.ok) {
    throw new Error('Não foi possível consultar o serviço de CEP.');
  }

  const data = await response.json();

  if (data.erro === true || data.erro === 'true') {
    throw new Error('CEP não encontrado na base do ViaCEP.');
  }

  return {
    cep: data.cep || cleanCep,
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || '',
  };
}

