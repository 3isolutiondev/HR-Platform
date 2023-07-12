import React, { Component } from 'react'
import * as Sentry from '@sentry/browser';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        if (process.env.NODE_ENV == 'production') {
            Sentry.captureException(error);
        }
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return null;
        }
        return this.props.children;
    }
}
