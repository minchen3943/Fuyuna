import HomeStatusBar from '@/components/HomeStatusBar';
import { infoConfig } from '@fuyuna/configs';
import '@/styles/homePage.scss';

export default function page() {
  const chars: string[] = 'Welcome,这里是'.split('');
  const names: string[] = infoConfig.getNameConfig().split('');
  const line1: string[] = [...chars, ...names];
  const line2: string[] = infoConfig.getLine1Config().split('');
  const line3: string[] = infoConfig.getLine2Config().split('');
  return (
    <>
      <div className="mx-[5vw] flex w-[90vw] flex-col items-center lg:mx-[10vw] lg:h-[94vh] lg:w-[80vw] lg:flex-row">
        <div className="mx-auto my-0 flex h-full w-fit pt-32 lg:w-1/2 lg:pt-60">
          <div className="flex h-fit w-fit flex-col gap-1 text-2xl lg:gap-3">
            <div className="flex lg:gap-0.5">
              {line1.map((char, index) => (
                <span
                  key={`line1-${index}`}
                  className={`animate-fade-up opacity-0 ${index <= 6 ? `` : `min-w-3`} delay-${index}`}
                >
                  {char}
                </span>
              ))}
              <span
                className={`animate-fade-up pl-1.5 opacity-0 lg:p-0 delay-${line1.length}`}
              >
                👋
              </span>
            </div>
            <div className="flex flex-col gap-1 lg:flex-row lg:gap-2">
              <div className="flex lg:gap-0.5">
                {line2.map((char, index) => (
                  <span
                    key={`line2-${index}`}
                    className={`animate-fade-up min-w-1 opacity-0 delay-${index + line1.length + 1}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex lg:gap-0.5">
                {line3.map((char, index) => (
                  <span
                    key={`line2-${index}`}
                    className={`animate-fade-up min-w-3 opacity-0 delay-${index + line1.length + line2.length + 1}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto my-0 flex h-full w-fit flex-row-reverse pr-0 pt-32 lg:w-1/2 lg:pr-2 lg:pt-72">
          <HomeStatusBar />
        </div>
      </div>
    </>
  );
}
