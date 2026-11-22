export interface Recipe {
  id: number;
  name: string;
  image: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  rating: number;
  tags: string[];
}

interface RecipesApiResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export async function fetchRecipes(query?: string): Promise<Recipe[]> {
  const cleanQuery = (query || '').trim();
  const url = cleanQuery
    ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(cleanQuery)}`
    : 'https://dummyjson.com/recipes?limit=15';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Falha ao carregar receitas da API externa.');
  }

  const data: RecipesApiResponse = await response.json();
  return data.recipes || [];
}

