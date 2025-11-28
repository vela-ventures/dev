export const ActionDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-around mb-2 md:mb-3 p-3 border border-transparent">
    <div className="flex items-center">
      <span>{children}</span>
    </div>
  </div>
);

export const Amount: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="font-bold whitespace-nowrap">{children}</span>
);
