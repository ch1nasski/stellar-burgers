import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const { ingredients, isLoading, error } = useSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    if (isLoading) return <Preloader />;
    return (
      <p className="text text_type_main-default">{error ?? 'Ингредиент не найден'}</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
