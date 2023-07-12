<html>
    <head>
        <style>
            /* @page {
                margin-left: 2.54cm;
                margin-right: 2.54cm;
                margin-top: 3.81cm;
                margin-bottom: 2.54cm;
            } */
            @page {
                header: page-header;
                footer: page-footer;
            }
            @font-face {
                font-family: Barlow;
                src: url('../../fonts/barlow/Barlow-Regular.otf');
            }
            /* @import url('https://fonts.googleapis.com/css?family=Barlow&display=swap'); */
            body {
                font-family: 'Barlow', sans-serif;
            }
            .page-content {
                margin-top: 3.81cm;
                margin-bottom: 2.54cm;
                margin-left: 2.54cm;
                margin-right: 2.54cm;
            }
            .tor-title {
                text-align: center;
                padding-top: 4px;
                padding-bottom: 4px;
                width: 100%;
                background: #be2126;
                color: white;
            }
            *, *:after, *:before {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            }
            .container {
                width: 100%;
            }
            /* .container:after {
                content: "";
                display: table;
                clear: both;
            }*/
            [class*='grid-'] {
            display: inline;
            }
            /* [class*='grid-'] {
            padding-right: 20px;
            }
            [class*='grid-']:last-of-type {
            padding-right: 0;
            } */
            .grid-4 {
                width: 25%;
            }
            .grid-8 {
                width: 74%;
            }
        </style>
    </head>
    <body>
        <htmlpageheader name="page-header" class="page-header">
            tes
        </htmlpageheader>
        <div class="page-content">


        </div>
        <htmlpagefooter name="page-footer">
            Your Footer Content
        </htmlpagefooter>
    </body>
</html>
{{-- body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
},
image: {
    width: '150px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    top: -30,
    marginBottom: -30
},
line: {
    backgroundColor: '#af1d2d',
    height: 15,
    marginTop: 10
},
title: {
    textAlign: 'center',
    color: '#FFF',
    backgroundColor: '#af1d2d',
    fontSize: 10,
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 10,
    textTransform: 'capitalize'
},
titleClose: {
    backgroundColor: '#af1d2d',
    marginTop: 100
},
headerContainer: {
    flexDirection: 'row',
    marginBottom: 1
},
leftColumn: {
    width: '150px'
},
rightColumn: {
    flex: 1
},
title1: {
    fontSize: 11,
    color: '#af1d2d',
    textDecoration: 'none'
},
date: {
    fontSize: 11
},
footer: {
    position: 'absolute',
    fontSize: 7,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'black'
} --}}
