import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    
    @import url('https://fonts.googleapis.com/css?family=Black+Han+Sans:400');

    .mainHeader {
        background-color: rgb(175, 202, 191);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 10px;
        font-family: Arial, Helvetica, sans-serif;
        height: 72px;
    }

    .mainHeader h2{
        color: white;
    }

    .subHeader {
        background-color: white;
        color:  rgb(175, 202, 191);
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px 10px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .subHeader h2{
        color:  rgb(175, 202, 191);
    }



    .intro {
        color: rgb(134, 134, 134);
        font-family: 'Black Han Sans', sans-serif;
        font-weight: 100;
        font-size: 25px;
    }

    .intro h4 {
        font-size: 35px;
    }

    span {
        padding: 0px 20px;
        justify-content: space-around;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .mainBox {
        border-radius: 15px;
        padding: 1px 20px;
        background-color: white;
    }

    .subBox {
        border-radius: 15px;
        padding: 1px 20px;
        background-color: rgb(175, 202, 191);
    }

    .contactBox {
        border-radius: 50px;
        padding: 1px 20px;
        background-color: white;
        display: flex;
        justify-content: space-around;
        height: 120px;
        width: 680px;
        align-items: center;
    }

    .main {
        background-color: rgb(239, 245, 243);
        display: flex;
        justify-content: space-around;
        padding: 160px 65px;
    }

    footer {
        margin: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .SNS {
        padding: 5px;
        justify-content: center;
        display: flex;
        gap: 20px;
    }

    .SNS img {
        width: 30px;
        height: auto;
    }

    p {
        font-family: 'Times New Roman', Times, serif;
        padding: 15px;
    }

    a {
        text-decoration: none;
    }

    .highlight_intro {
        color: rgb(175, 202, 191);
        display: inline;
    }

    h1 {
        font-family: 'Black Han Sans';
        color: rgb(175, 202, 191);
    }

    .not_ready {
        justify-content: center;
    }
`;