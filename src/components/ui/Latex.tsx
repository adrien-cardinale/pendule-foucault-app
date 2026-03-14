import { useMemo } from "react";
import "katex/dist/katex.min.css";
import { renderToString } from "katex";

type Props = {
	tex: string;
	displayMode?: boolean;
	className?: string;
};

export default function Latex({ tex, displayMode = false, className }: Props) {
	const html = useMemo(() => {
		try {
			return renderToString(tex, { throwOnError: false, displayMode });
		} catch (e) {
			return tex;
		}
	}, [tex, displayMode]);

	return (
		<span className={className} dangerouslySetInnerHTML={{ __html: html }} />
	);
}
