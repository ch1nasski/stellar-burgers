import { resolve } from 'node:path';

import { expect, test } from '@playwright/test';

const constructorHar = resolve('tests/hars/constructor.har');
const bunName = 'Краторная булка N-200i';
const fillingName = 'Говяжий метеорит (отбивная)';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(constructorHar, {
      url: '**/api/**',
      update: false,
    });
    await page.goto('/');
  });

  test('adds a bun and filling from the ingredient list', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: bunName });
    const fillingCard = page.getByRole('listitem').filter({ hasText: fillingName });
    const burgerConstructor = page.locator('section[class*="burger_constructor"]');

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(burgerConstructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(burgerConstructor.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(burgerConstructor.getByText(fillingName)).toBeVisible();
  });

  test('opens ingredient details and closes them with the close button', async ({
    page,
  }) => {
    await page.getByRole('link', { name: new RegExp(bunName) }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: bunName })).toBeVisible();
    const ingredientDetails = page
      .getByRole('heading', { name: 'Детали ингредиента' })
      .locator('..');
    await expect(ingredientDetails.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.test/bun-large.png'
    );
    await expect(ingredientDetails.getByText('420', { exact: true })).toBeVisible();
    await expect(ingredientDetails.getByText('80', { exact: true })).toBeVisible();
    await expect(ingredientDetails.getByText('24', { exact: true })).toBeVisible();
    await expect(ingredientDetails.getByText('53', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('/');
  });

  test('closes ingredient details by clicking the overlay', async ({ page }) => {
    await page.getByRole('link', { name: new RegExp(bunName) }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.locator('div[class*="overlay"]').click({
      position: { x: 10, y: 10 },
    });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
    await expect(page).toHaveURL('/');
  });

  test('submits an order, clears the constructor and closes the order modal', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        url: 'http://127.0.0.1:4000',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    const orderNumber = 123456;
    await page.reload();
    const bunCard = page.getByRole('listitem').filter({ hasText: bunName });
    const fillingCard = page.getByRole('listitem').filter({ hasText: fillingName });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();
    const orderRequestPromise = page.waitForRequest(
      (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
    );
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderRequest = await orderRequestPromise;
    expect(orderRequest.headers().authorization).toContain('test-access-token');
    expect(JSON.parse(orderRequest.postData() ?? '{}')).toEqual({
      ingredients: ['bun-id', 'filling-id', 'bun-id'],
    });
    await expect(page.getByText(String(orderNumber))).toBeVisible();
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

    const burgerConstructor = page.locator('section[class*="burger_constructor"]');
    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(burgerConstructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('Ваш заказ начали готовить')).toHaveCount(0);
  });
});
