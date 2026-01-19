import claraImage from '@/assets/characters/clara.png';

interface ProfileAvatarProps {
  onProfileClick: () => void;
}

const ProfileAvatar = ({ onProfileClick }: ProfileAvatarProps) => {
  return (
    <button
      onClick={onProfileClick}
      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform"
      aria-label="Perfil"
    >
      <img
        src={claraImage}
        alt="Perfil da Clara"
        className="w-full h-full object-cover object-top"
      />
    </button>
  );
};

export default ProfileAvatar;
