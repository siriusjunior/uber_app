import React, { Fragment, useEffect } from 'react';

//apis
import { fetchRestaurants } from '../apis/restaurants';

export const Restaurants = () => {

  useEffect(() => {
    fetchRestaurants()
    .then((data)=>
      console.log(data)
    )
  },[])
  // コンポーネントのレンダリング時に一度だけ実行するので第二引数に空配列

  return (
    <Fragment>
      レストラン一覧
    </Fragment>
  )
}