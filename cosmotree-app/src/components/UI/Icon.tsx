import React from 'react';
import { 
  RocketIcon, 
  ArrowBack, 
  MoonStars, 
  PlanetIcon, 
  BookIcon,
  NeurologyIcon,
  Stars2Icon,
  IconName,
  iconInfo 
} from '../../assets/icons';

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  alt?: string;
}

// Map icon names to their imported SVG components
const iconMap: Record<IconName, string> = {
  rocket: RocketIcon,
  arrowBack: ArrowBack,
  arrow: ArrowBack,
  moonStars: MoonStars,
  planet: PlanetIcon,
  book: BookIcon,
  neurology: NeurologyIcon,
  stars2: Stars2Icon
};

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = '24', 
  className = '', 
  alt 
}) => {
  const IconComponent = iconMap[name];
  const iconMeta = iconInfo[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const altText = alt || iconMeta?.description || `${iconMeta?.name} icon`;

  return (
    <img
      src={IconComponent}
      alt={altText}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  );
};

export default Icon;

// Export IconProps type for external use
export type { IconProps };
