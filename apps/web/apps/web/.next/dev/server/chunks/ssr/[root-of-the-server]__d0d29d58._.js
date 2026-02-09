module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/web/apps/web/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$5$2e$2_$40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.5.2_@supabase+supabase-js@2.93.2/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$5$2e$2_$40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.5.2_@supabase+supabase-js@2.93.2/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    const supabaseUrl = (("TURBOPACK compile-time value", "https://cscalirkehnbuqmjgkwr.supabase.co") ?? "").trim();
    const supabaseAnonKey = (("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2FsaXJrZWhuYnVxbWpna3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTU3NTUsImV4cCI6MjA4NDkzMTc1NX0.qr9NRjxCnnWG4AnAqoz_YhNYrKdGw2gvMbvDN_B44Ds") ?? "").trim();
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$5$2e$2_$40$supabase$2b$supabase$2d$js$40$2$2e$93$2e$2$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
}
}),
"[project]/apps/web/apps/web/lib/firebase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFirebaseApp",
    ()=>getFirebaseApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$40$12$2e$9$2e$0_$40$react$2d$native$2d$async$2d$storage$2b$async$2d$storage$40$2$2e$2$2e$0_react$2d$native$40$0$2e$81$2e$5_$40$babel$2b$co_gpizxejy6kbocnrxjjnej3dj2i$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/firebase@12.9.0_@react-native-async-storage+async-storage@2.2.0_react-native@0.81.5_@babel+co_gpizxejy6kbocnrxjjnej3dj2i/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@firebase+app@0.14.8/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
;
function getFirebaseConfig() {
    const apiKey = ("TURBOPACK compile-time value", "AIzaSyAJDcqP3Cytnc-lelF5XFNDJtmmxl28xpQ");
    const authDomain = ("TURBOPACK compile-time value", "automation-6d864.firebaseapp.com");
    const projectId = ("TURBOPACK compile-time value", "automation-6d864");
    const storageBucket = ("TURBOPACK compile-time value", "automation-6d864.firebasestorage.app");
    const messagingSenderId = ("TURBOPACK compile-time value", "78120781764");
    const appId = ("TURBOPACK compile-time value", "1:78120781764:web:36d71d29afb61c6d668691");
    const measurementId = ("TURBOPACK compile-time value", "G-M5R0TKJLX2");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId
    };
}
function getFirebaseApp() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])().length > 0) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApp"])();
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(getFirebaseConfig());
}
}),
"[project]/apps/web/apps/web/lib/firebase/messaging.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attachForegroundMessageHandler",
    ()=>attachForegroundMessageHandler,
    "requestWebPushToken",
    ()=>requestWebPushToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$40$12$2e$9$2e$0_$40$react$2d$native$2d$async$2d$storage$2b$async$2d$storage$40$2$2e$2$2e$0_react$2d$native$40$0$2e$81$2e$5_$40$babel$2b$co_gpizxejy6kbocnrxjjnej3dj2i$2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/firebase@12.9.0_@react-native-async-storage+async-storage@2.2.0_react-native@0.81.5_@babel+co_gpizxejy6kbocnrxjjnej3dj2i/node_modules/firebase/messaging/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$messaging$40$0$2e$12$2e$23_$40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@firebase+messaging@0.12.23_@firebase+app@0.14.8/node_modules/@firebase/messaging/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/apps/web/lib/firebase/client.ts [app-ssr] (ecmascript)");
;
;
let foregroundHandlerAttached = false;
async function getServiceWorkerRegistration() {
    if (("TURBOPACK compile-time value", "undefined") === "undefined" || !("serviceWorker" in navigator)) {
        return null;
    }
    //TURBOPACK unreachable
    ;
}
async function requestWebPushToken() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            ok: false,
            reason: "browser-only"
        };
    }
    //TURBOPACK unreachable
    ;
    const supported = undefined;
    const vapidKey = undefined;
    const permission = undefined;
    const registration = undefined;
    const messaging = undefined;
    const token = undefined;
}
async function attachForegroundMessageHandler(onPayload) {
    if (foregroundHandlerAttached) {
        return;
    }
    const supported = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$messaging$40$0$2e$12$2e$23_$40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSupported"])().catch(()=>false);
    if (!supported) {
        return;
    }
    foregroundHandlerAttached = true;
    const messaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$messaging$40$0$2e$12$2e$23_$40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMessaging"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseApp"])());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$firebase$2b$messaging$40$0$2e$12$2e$23_$40$firebase$2b$app$40$0$2e$14$2e$8$2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onMessage"])(messaging, (payload)=>{
        onPayload?.(payload);
    });
}
}),
"[project]/apps/web/apps/web/lib/firebase/register-web-push.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerWebPush",
    ()=>registerWebPush
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/apps/web/lib/firebase/messaging.ts [app-ssr] (ecmascript)");
;
const LAST_REGISTERED_TOKEN_KEY = "automation:last-registered-fcm-token";
async function saveTokenToServer(token) {
    const response = await fetch("/api/notifications/fcm-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token,
            platform: "web",
            userAgent: navigator.userAgent
        })
    });
    if (!response.ok) {
        const body = await response.json().catch(()=>({}));
        const message = typeof body?.error === "string" ? body.error : "Failed to register push token";
        throw new Error(message);
    }
}
async function registerWebPush({ force = false, userId } = {}) {
    const tokenResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$messaging$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestWebPushToken"])();
    if (!tokenResult.ok) {
        return tokenResult;
    }
    const { token } = tokenResult;
    const storageKey = userId ? `${LAST_REGISTERED_TOKEN_KEY}:${userId}` : LAST_REGISTERED_TOKEN_KEY;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const previousToken = ("TURBOPACK compile-time truthy", 1) ? null : "TURBOPACK unreachable";
    if (!force && previousToken === token) {
        return {
            ok: true,
            token,
            skipped: true
        };
    }
    await saveTokenToServer(token);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        ok: true,
        token,
        skipped: false
    };
}
}),
"[project]/apps/web/apps/web/components/auth/auth-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.6_babel-plugin-react-compiler@1.0.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.6_babel-plugin-react-compiler@1.0.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/apps/web/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$register$2d$web$2d$push$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/apps/web/lib/firebase/register-web-push.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const pushRegistrationForUserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session)=>{
            setUser(session?.user ?? null);
            setLoading(false);
        });
        supabase.auth.getSession().then(({ data: { session } })=>{
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return ()=>subscription.unsubscribe();
    }, [
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) {
            pushRegistrationForUserRef.current = null;
            return;
        }
        if (pushRegistrationForUserRef.current === user.id) {
            return;
        }
        pushRegistrationForUserRef.current = user.id;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$apps$2f$web$2f$lib$2f$firebase$2f$register$2d$web$2d$push$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerWebPush"])({
            userId: user.id
        }).then((result)=>{
            if (!result.ok) {
                console.info("Web push registration skipped:", result.reason);
                return;
            }
            if (!result.skipped) {
                console.info("Web push token registered for user.");
            }
        }).catch((error)=>{
            console.error("Web push registration failed:", error);
        });
    }, [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/apps/web/components/auth/auth-provider.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$6_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (ctx === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d0d29d58._.js.map