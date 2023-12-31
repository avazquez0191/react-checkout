import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkoutActions, updateProduct, ICheckoutState, IProduct } from 'store/checkout';
import { RootState, AppDispatch } from 'store';
import { styled } from 'styled-components';

export function Resume() {
  const dispatch = useDispatch<AppDispatch>();
  const checkout = useSelector<RootState, ICheckoutState>((state) => state.checkout);
  const product: IProduct = checkout.product;
  const promoId = checkout.promoId;
  const taxName = checkout.taxName;

  const productPromoName = () => {
    const promo = product?.promotions?.find(promo => promo.id == promoId);
    return promo?.name;
  };

  const productPromoType = () => {
    const promo = product?.promotions?.find(promo => promo.id == promoId);
    return promo?.type;
  };

  const priceRules = {
    productPrice: () => {
      const price = product?.prices?.find(price => price.name == taxName);
      return price?.price?.toFixed(2);
    },
    productPriceFinal: () => {
      const price = product?.prices?.find(price => price.name == taxName);
      const originalPrice = price?.price;
      const installationCost = 96.80;
      return (productPromoType() == 'STANDARD')? originalPrice : (Number(originalPrice) + Number(installationCost)).toFixed(2);
    }
  };

  const nextStepHandler = () => {
    dispatch(checkoutActions.nextStep());
  };

  return (
    <>
      <Title>03. Resumen de tu pedido</Title>

      <p>Tu tarifa</p>
      <Row>
        <Block>
          <p>{product.webInfo.analyticsName}</p>
          <p>{productPromoName()}</p>
        </Block>
        <Block>
          <MidSuper>{priceRules.productPrice()}€</MidSuper>
          <p className='text-green'>{productPromoType() == 'STANDARD'? '3 meses' : '0 meses'}</p>
        </Block>
      </Row>

      <Separator />
      <p>El primer mes pagarás</p>
      <Row>
        <Block>
          <ul className='no-style'>
            <li>Envío y activación de la SIM</li>
            <li>Instalación</li>
            <li>Descuento por Instalación</li>
          </ul>
        </Block>
        <Block>
          <ul className='no-style text-right'>
            <li>0,00€</li>
            <li>96,80€</li>
            <li>{productPromoType() == 'STANDARD'? -96.80 : 0}€</li>
          </ul>
          <MidSuper>{priceRules.productPriceFinal()}€</MidSuper>
        </Block>
      </Row>

      <Separator />
      <p>Todos los meses pagarás</p>
      <Row>
        <Block>
        </Block>
        <Block>
          <Super>{priceRules.productPriceFinal()}€</Super>
        </Block>
      </Row>
    </>
  );
}

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: ${p => p.theme.colors.primaryText};
  margin: 1rem 0;
`;

const Super = styled.span`
  font-size: 50px;
  font-weight: bold;
  color: ${p => p.theme.colors.primaryText};
  margin: 1rem 0;
  letter-spacing: -2pt;
`;

const MidSuper = styled.span`
  font-size: 25px;
  font-weight: bold;
  color: ${p => p.theme.colors.primaryText};
  margin: 1rem 0;
  letter-spacing: -2pt;
`;

const Row = styled.div`
  display: flex; 
  justify-content: space-between;
`;

const Block = styled.div`
`;

const Separator = styled.hr`
  margin: 1rem 0;
  border-bottom: 2px solid  ${p => p.theme.colors.primaryText};
`;