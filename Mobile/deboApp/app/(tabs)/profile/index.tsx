import ProfileScreen from '@/src/screens/Profile';
import { useRouter } from 'expo-router';

export default function Profile() {
    const router = useRouter();
    return <ProfileScreen navigation={router} />;
}
