import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingComponent from '../components/Loading/LoadingComponent';
import { canAccess } from './accessPolicy';

function ProtectedRoute({ allowedRoles, children }) {
	const { isAuthenticated, isLoading, user } = useAuth0();
	const { t } = useTranslation('app');

	if (isLoading) return <LoadingComponent />;
	if (!isAuthenticated) return <Navigate to="/" replace />;
	if (!canAccess(user, allowedRoles)) {
		return (
			<main className="access-denied" role="alert">
				<h1>{t('accessDeniedTitle')}</h1>
				<p>{t('accessDeniedMessage')}</p>
			</main>
		);
	}

	return children;
}

export default ProtectedRoute;
