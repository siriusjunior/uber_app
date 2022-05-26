// 仮注文のデータをまとめて取得→本注文のボタンの表示→本注文データの登録
import React, { Fragment, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

// components
import { OrderDetailItem } from '../components/OrderDetailItem';
import { OrderButton } from '../components/Buttons/OrderButton';
import CircularProgress from '@material-ui/core/CircularProgress';

// apis
import { fetchLineFoods } from '../apis/line_foods';
import { postOrder } from '../apis/orders';

// reducers
import {
  initialState,
  lineFoodsActionTypes,
  lineFoodsReducer,
  lineFoodsSummary,
} from '../reducers/lineFoods';

// images
import MainLogo from '../images/logo.png';

// constants
import { REQUEST_STATE } from '../constants';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 32px;
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
`;

export const Orders = () => {
  const[state, dispatch] = useReducer(lineFoodsReducer, initialState);

  useEffect(() => {
    dispatch({type: lineFoodsActionTypes.FETCHING})
    fetchLineFoods()
    // 店舗内の'activeな'仮注文データをまとめて表示(Cf.line_foods_controller#index)
    .then((data) =>
      dispatch({
        type: lineFoodsActionTypes.FETCH_SUCCESS,
        payload: {
          lineFoodsSummary: data
        }
      })
    )
    .catch((e) => console.error(e));
  },[]);

  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionTypes.POSTING});
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids,
    }).then(() => {
      dispatch({ type: lineFoodsActionTypes.POST_SUCCESS });
      window.location.reload();
      // L18に戻る、本注文データ登録時にorderに紐付くline_foodsのactiveを非活性化
    });
  }

  const orderButtonLabel = () => {
    switch(state.postState){
      case REQUEST_STATE.LOADING:
        return '注文中...';
      case REQUEST_STATE.OK:
        return '注文が完了しました!';
      default:
        return '注文を確定する';
    }
  };

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo"/>
        </Link>
      </HeaderWrapper>
      <OrderListWrapper>
        <div>
          <OrderItemWrapper>
            {
              //ローディング中にCircularProgressを表示
              state.fetchState ===  REQUEST_STATE.LOADING ?
              <CircularProgress/>
            :
              state.lineFoodsSummary &&
                <OrderDetailItem
                  restaurantId={state.lineFoodsSummary.restaurant.id}
                  restaurantName={state.lineFoodsSummary.restaurant.name}
                  restaurantFee={state.lineFoodsSummary.restaurant.fee}
                  timeRequired={state.lineFoodsSummary.restaurant.time_required}
                  foodCount={state.lineFoodsSummary.count}
                  price={state.lineFoodsSummary.amount}
                />
            }
          </OrderItemWrapper>
          <div>
            {
              state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary &&
              <OrderButton
                onClick={() => postLineFoods()}
                disabled={state.postState === REQUEST_STATE.LOADING || state.postState === REQUEST_STATE.OK }
              >
                {orderButtonLabel()}
              </OrderButton>
            }
            {
              state.fetchState === REQUEST_STATE.OK && !(state.lineFoodsSummary) &&
              <p>
                注文予定の商品はありません。
              </p>
            }
          </div>
        </div>
      </OrderListWrapper>
    </Fragment>
  )
}