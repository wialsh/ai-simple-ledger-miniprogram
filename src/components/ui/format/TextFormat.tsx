interface TextFormatProps {
  Text: string;
  subText: string;
}
// 主副文本（Primary-Secondary Text）展示
export const TextFormat: React.FC<TextFormatProps> = ({ Text, subText }) => {
  return (
    <span className='inline-flex items-baseline font-base tracking-tight'>
      <span className='text-2xl'>{Text}</span>
      <span className='text-sm text-gray-700'>{subText}</span>
    </span>
  );
};
