import { Application, send } from "https://deno.land/x/oak@v5.0.0/mod.ts";

const app = new Application();
const PORT = 8000;

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
  ];
  if (fileWhitelist.includes(filePath)){
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`,
    });
  }
});

app.use(async (ctx, next) => {
  ctx.response.body = `
    {___     {__      {_         {__ __        {_       
    {_ {__   {__     {_ __     {__    {__     {_ __     
    {__ {__  {__    {_  {__     {__          {_  {__    
    {__  {__ {__   {__   {__      {__       {__   {__   
    {__   {_ {__  {______ {__        {__   {______ {__  
    {__    {_ __ {__       {__ {__    {__ {__       {__
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
  await next();
});

if (import.meta.main) {
  await app.listen({
    port: PORT
  });
}
