interface Member {
  userId: number;
  name: string;
}

interface Props {
  members: Member[];
  max?: number;
}

const AvatarStack = ({ members, max = 3 }: Props) => {
  const shown = members.slice(0, max);
  const remaining = members.length - shown.length;

  const colors = [
    'bg-indigo-500',
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-rose-500',
  ];

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((m, i) => (
        <div
          key={m.userId}
          className={`w-7 h-7 rounded-full ${colors[i % colors.length]}
                      flex items-center justify-center text-white
                      text-[10px] font-bold border-2 border-white`}
          title={m.name}
        >
          {m.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600
                        flex items-center justify-center text-[10px] font-bold
                        border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;