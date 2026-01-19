import claraImage from '@/assets/characters/clara.png';

interface ProfileAvatarProps {
  onProfileClick: () => void;
}

const ProfileAvatar = ({ onProfileClick }: ProfileAvatarProps) => {
  return (
    <button
      onClick={onProfileClick}
      className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-xl hover:scale-110 transition-transform ring-2 ring-blue-400/50"
      aria-label="Perfil"
      title="Ver Perfil"
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
