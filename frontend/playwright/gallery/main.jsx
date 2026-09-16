import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import i18n from '../../e2e/support/i18n';
import { Concierge as AppConcierge } from '../../src/App.story';

const stories = {
	'App/Concierge': AppConcierge,
};
const root = createRoot(document.getElementById('root'));

window.mount = async ({ story, props = {} }) => {
	const Story = stories[story];
	if (!Story) throw new Error(`Unknown story: ${story}`);
	if (props.path) window.history.replaceState({}, '', props.path);
	await i18n.changeLanguage('en');
	root.render(<Suspense fallback={<p>Loading…</p>}><Story {...props} /></Suspense>);
	await new Promise((resolve) => requestAnimationFrame(resolve));
};

window.unmount = async () => {
	root.render(null);
	await new Promise((resolve) => requestAnimationFrame(resolve));
};
