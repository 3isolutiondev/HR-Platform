import React from 'react';
import ReactDOM from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import './utils/axiosSetup';
import './utils/checkSidebarOpen';
import Loadable from 'react-loadable';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { primaryColor, secondaryColor, borderColor } from './config/colors';
import red from '@material-ui/core/colors/red';
import './assets/css/base.css';
import 'axios-progress-bar/dist/nprogress.css';
import 'chart.js/dist/Chart.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'core-js/fn/array/includes';

import { createBrowserHistory } from 'history';
import LoadingSpinner from './common/LoadingSpinner';
import CookieConsent from './common/GDPR/CookieConsent';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
export const browserHistory = createBrowserHistory();

const Routes = Loadable({
  loader: () => import('./routes/routes'),
  loading: LoadingSpinner,
  timeout: 20000, // 20 seconds
  delay: 500 // 0.5 seconds
});

const defaultTheme = createMuiTheme();
export const themeOptions = {
  palette: {
    primary: {
      main: primaryColor
    },
    secondary: {
      main: secondaryColor
    },
    error: {
      main: red['A700']
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14
  },
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: 'none !important',
        border: '1px solid ' + borderColor
      }
    },
    MuiDialog: {
      paper: {
        boxShadow:
          '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12) !important'
      }
    },
    MuiAppBar: {
      root: {
        border: 'none'
      }
    },
    MuiStepper: {
      root: {
        border: 'none'
      }
    },
    MuiChip: {
      root: {
        'margin-bottom': '4px'
      }
    },
    MuiButton: {
      contained: {
        boxShadow: 'none !important'
      }
    },
    MuiFab: {
      root: {
        boxShadow: 'none !important'
      }
    },
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'max-content !important'
      }
    },
    MUIDataTableBodyCell: {
      root: {
        '&:nth-last-child(-n+2)': {
          height: 'inherit'
        }
      }
    },
    MuiTabs: {
      root: {
        borderBottom: `1px solid ${primaryColor}`,
        marginBottom: 16,
      },
    },
    MuiSnackbar: {
      root: {
        [defaultTheme.breakpoints.down("sm")]: {
          top: `${defaultTheme.spacing.unit * 2}px !important`,
          right: `${defaultTheme.spacing.unit * 3}px !important`,
          marginLeft: `${defaultTheme.spacing.unit}px !important`,
        }
      }
    }
  }
}
const theme = createMuiTheme(themeOptions);

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes />
            <CookieConsent />
          </ErrorBoundary>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </MuiThemeProvider>
);

if (process.env.NODE_ENV == 'production') {
  Sentry.init({
    environment: process.env.SENTRY_APP,
    dsn: "https://0ae375a85c0b4066a8da107fa9a0771d@o391832.ingest.sentry.io/5241535",
    ignoreErrors: ['ResizeObserver loop completed with undelivered notifications.'],
    beforeSend(event, hint) {
      const isNonErrorException =
          event.exception.values[0].value.startsWith('Non-Error exception captured') || (hint.originalException ?
          hint.originalException['message'].startsWith('Non-Error exception captured') : false) ;
      if (isNonErrorException) {
          return null;
      }
      return event;
  }
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
