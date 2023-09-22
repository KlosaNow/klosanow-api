const getCookies = (cookieHeader: string) => {
    const cookies: { [key: string]: string } = {};
    cookieHeader.split(";").forEach((cookie) => {
        const parts = cookie.split("=");
        const name = parts[0].trim();
        const value = parts[1]?.trim() || "";
        cookies[name] = value;
    });
    return cookies;
};

export default getCookies