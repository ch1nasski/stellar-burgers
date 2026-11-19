import { Preloader, IngredientDetailsUI } from '@ui';
import { useLocation, useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const location = useLocation();
  const hasBackground = Boolean(
    (location.state as { background?: unknown } | null)?.background
  );
  const { ingredients, isLoading, error } = useSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  let content: React.JSX.Element;
  if (!ingredientData) {
    content = isLoading ? (
      <Preloader />
    ) : (
      <p className="text text_type_main-default">{error ?? 'Ингредиент не найден'}</p>
    );
  } else {
    content = <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  return hasBackground ? content : <main className={styles.page}>{content}</main>;
};
