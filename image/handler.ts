interface ImageOption {
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  width?: number;
  height?: number;
  quality?: number;
  format?: "avif" | "webp" | "json";
}

interface Option {
  cf: {
    image: ImageOption;
  };
}

export const handleRequest = async (request: Request): Promise<Response> => {
  let url = new URL(request.url);

  let options: Option = { cf: { image: {} } };

  if (url.searchParams.has("fit")) {
    const fit = url.searchParams.get("fit")!;
    if (
      fit === "scale-down" ||
      fit === "contain" ||
      fit === "cover" ||
      fit === "crop" ||
      fit === "pad"
    )
      options.cf.image.fit = fit;
  }
  if (url.searchParams.has("width")) {
    options.cf.image.width = Number(url.searchParams.get("width")!);
  }
  if (url.searchParams.has("height")) {
    options.cf.image.height = Number(url.searchParams.get("height")!);
  }
  if (url.searchParams.has("quality")) {
    options.cf.image.quality = Number(url.searchParams.get("quality")!);
  }

  const accept = request.headers.get("Accept");
  if (accept) {
    if (/image\/avif/.test(accept)) {
      options.cf.image.format = "avif";
    } else if (/image\/webp/.test(accept)) {
      options.cf.image.format = "webp";
    }
  }

  const imageURL = url.searchParams.get("image");
  if (!imageURL) return new Response('Missing "image" value', { status: 400 });

  try {
    const { pathname } = new URL(imageURL);

    if (imageURL.startsWith("https://og.light.so")) {
      url.searchParams.delete("image");
      url.searchParams.delete("width");
      return Response.redirect(`${imageURL}&${url.searchParams.toString()}`);
    }

    if (!/\.(jpe?g|png|gif|webp)$/i.test(pathname)) {
      return Response.redirect(imageURL);
    }
  } catch (err) {
    return new Response('Invalid "image" value', { status: 400 });
  }

  const imageRequest = new Request(imageURL, {
    headers: request.headers,
  });

  return fetch(imageRequest, options);
};
