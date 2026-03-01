import ChangePasswordScreen from '@/src/screens/ChangePasswordScreen';
import { useRouter } from 'expo-router';

export default function ChangePassword() {
    const router = useRouter();
    return <ChangePasswordScreen navigation={router} />;
}
