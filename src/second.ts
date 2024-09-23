interface Category {
    id: number;
    name: string;
}
  
interface Tag {
    id: number;
    name: string;
}
  
type PetStatus = 'available' | 'pending' | 'sold';

interface Pet {
    id: number;
    name: string;
    category?: Category;
    photoUrls: string[];
    tags?: Tag[];
    status: PetStatus;
}

async function getAvailablePets(): Promise<Pet[]> {
    try {
      const response = await fetch('https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available');
      const data = await response.json() as Pet[];
      return data;
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    }
}

getAvailablePets().then(pets => {
    console.log(pets);
  }).catch(error => {
    console.error('Ошибка:', error);
  });