## アプリケーションの題材
「[RailsとReactでUberEats風SPAアプリケーションをつくってみよう！](https://www.techpit.jp/courses/138/curriculums/141/sections/1044/parts/4128)」に倣い、UberEats(Web版)を題材として、ベーシックなSPA(Single Page Application)を開発した。

サーバーサイドで`Ruby on Rails(以下、Rails)`、フロントエンドでは`React`を使用

## 動作イメージ
### 正常系
店舗内の仮注文を作る場合

[![Image from Gyazo](https://i.gyazo.com/1836063d5712826aec1191552a6cd884.gif)](https://gyazo.com/1836063d5712826aec1191552a6cd884)

### 異常系
他店舗のactiveな仮注文がある場合に、店舗内の仮注文を作る場合

[![Image from Gyazo](https://i.gyazo.com/e08bf78dd8c56ecec070b6d4a4e949d4.gif)](https://gyazo.com/e08bf78dd8c56ecec070b6d4a4e949d4)

## 動作環境
- `Rails 6.1.5.1` 
- `React 18.1.0`
