import UpdateProfileScreen from '@/src/screens/UpdateProfileScreen';
import { useRouter } from 'expo-router';

export default function UpdateProfile() {
    const router = useRouter();
    return <UpdateProfileScreen navigation={router} />;
}
