import { h, render } from 'preact';
import App from './app.js';

const root = document.getElementById('root');

render(h(App, null), root);
