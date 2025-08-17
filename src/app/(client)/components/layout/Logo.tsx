import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement> & {
	title?: string;
	decorative?: boolean;
};

export function LogoMark({ title = 'LangRoute', decorative = true, className, ...props }: Props) {
	const clipId = React.useId();

	return (
		<svg
			viewBox='0 0 32 32'
			role='img'
			aria-label={decorative ? undefined : title}
			aria-hidden={decorative ? true : undefined}
			className={className}
			{...props}
		>
			{/* Rounded square bg uses currentColor (controlled via parent text-* classes) */}
			<rect
				width='32'
				height='32'
				rx='4'
				fill='currentColor'
			/>

			{/* Inner glyph uses --background so it contrasts in light/dark automatically */}
			<g clipPath={`url(#${clipId})`}>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M22.6668 11.9999C23.035 11.9999 23.3335 12.2984 23.3335 12.6666L23.3335 19.3333C23.3335 19.7014 23.035 19.9999 22.6668 19.9999C22.2986 19.9999 22.0002 19.7014 22.0002 19.3333L22.0002 12.6666C22.0002 12.2984 22.2986 11.9999 22.6668 11.9999ZM20.0002 10.6666C20.3684 10.6666 20.6668 10.9651 20.6668 11.3333L20.6668 20.6666C20.6668 21.0348 20.3684 21.3333 20.0002 21.3333C19.632 21.3333 19.3335 21.0348 19.3335 20.6666L19.3335 11.3333C19.3335 10.9651 19.632 10.6666 20.0002 10.6666ZM16.6668 11.3333C16.6668 10.9651 16.3684 10.6666 16.0002 10.6666L10.6668 10.6666C10.2986 10.6666 10.0002 10.9651 10.0002 11.3333L10.0002 20.6666C10.0002 21.0348 10.2986 21.3333 10.6668 21.3333L16.0002 21.3333C16.3684 21.3333 16.6668 21.0348 16.6668 20.6666L16.6668 11.3333ZM16.0002 9.33325C17.1047 9.33325 18.0002 10.2287 18.0002 11.3333L18.0002 20.6666C18.0002 21.7712 17.1047 22.6666 16.0002 22.6666L10.6668 22.6666C9.56226 22.6666 8.66683 21.7712 8.66683 20.6666L8.66683 11.3333C8.66683 10.2287 9.56226 9.33325 10.6668 9.33325L16.0002 9.33325Z'
					fill='var(--background)'
				/>
			</g>
			<defs>
				<clipPath id={clipId}>
					<rect
						width='16'
						height='16'
						transform='translate(24 8) rotate(90)'
					/>
				</clipPath>
			</defs>
		</svg>
	);
}

export function LogoWordmark({
	className = 'font-semibold',
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={className}
			{...props}
		>
			<span className='text-foreground'>LANG</span>
			<span className='text-muted-foreground'>ROUTE</span>
		</span>
	);
}
