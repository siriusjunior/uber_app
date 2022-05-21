import React, { Fragment,useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

// components
import { LocalMallIcon } from '../components/Icons';
import { FoodWrapper } from '../components/FoodWrapper';
import Skeleton from '@material-ui/lab/Skeleton';
import { FoodOrderDialog } from '../components/FoodOrderDialog';

// reducers
import {
  initialState as foodsInitialState,
  foodsActionTypes,
  foodsReducer,
} from '../reducers/foods';

// apis
import { fetchFoods } from '../apis/foods';

// images
import MainLogo from '../images/logo.png'
import FoodImage from '../images/food-image.jpg'

// constants
import { COLORS } from '../style_constants';
import { REQUEST_STATE } from '../constants';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ({
  match
}) => {
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  
  // モダールのためのState
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
  }
  const[state, setState] = useState(initialState);

  useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });
    fetchFoods(match.params.restaurantsId)
      .then((data) => {
        dispatch({
          type: foodsActionTypes.FETCH_SUCCESS,
          payload: {
            foods: data.foods
             // Cf.foods_controller.rbよりrender json: { foods: foods }
          }
        });
      })
  },[]);

return(
  <Fragment>
    <HeaderWrapper>
      <Link to="/restaurants">
        <MainLogoImage src={MainLogo} alt="main logo"/>
      </Link>
      <BagIconWrapper>
        <Link to="/orders">
          <ColoredBagIcon fontSize="large" />
        </Link>
      </BagIconWrapper>
    </HeaderWrapper>
    <FoodsList>
    {
      foodsState.fetchState === REQUEST_STATE.LOADING?
        <Fragment>
          {
            [...Array(12).keys()].map(i =>
                <ItemWrapper key={i}>
                  <Skeleton key={i} variant="rect" animation="wave" width={450} height={180} />
                </ItemWrapper>
              )
          }
        </Fragment>
      :
        foodsState.foodsList.map(food => 
          <ItemWrapper key={food.id}>
            <FoodWrapper 
              food={food}
              onClickFoodWrapper={
                (food) => setState({
                  ...state,
                  isOpenOrderDialog: true,
                  selectedFood: food,
                })
              }
              imageUrl={FoodImage}
            />
          </ItemWrapper>
        )
    }
    </FoodsList>
    {
      state.isOpenOrderDialog &&
      <FoodOrderDialog
        isOpen={state.isOpenOrderDialog}
        food={state.selectedFood}
        countNumber={state.selectedFoodCount}
        onClickCountUp={()=> setState({
          ...state,
          selectedFoodCount: state.selectedFoodCount + 1,
        })}
        onClickCountDown={()=> setState({
          ...state,
          selectedFoodCount: state.selectedFoodCount - 1,
        })}
        onClose={() => setState({
          // 枠外clickで発動
          ...state,
          isOpenOrderDialog: false,
          selectedFood: null,
          selectedFoodCount: 1,
        })}
      />
    }
  </Fragment>
  )
}