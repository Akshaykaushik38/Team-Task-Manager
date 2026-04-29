# =============================================
# Stage 1: Build Angular Frontend
# =============================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies
COPY Frontend/package*.json ./
RUN npm ci

# Copy source and build for production
COPY Frontend/ ./
RUN npm run build -- --configuration production

# =============================================
# Stage 2: Build .NET Backend
# =============================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build

WORKDIR /app/backend

# Copy project file and restore dependencies
COPY Backend/*.csproj ./
RUN dotnet restore

# Copy rest of backend source
COPY Backend/ ./

# Publish the backend in release mode
RUN dotnet publish -c Release -o /app/publish

# =============================================
# Stage 3: Final Runtime Image
# =============================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

# Copy the published .NET backend
COPY --from=backend-build /app/publish .

# Copy Angular build output into wwwroot so .NET can serve it
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./wwwroot

# Railway uses PORT env variable, default to 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TaskManager.API.dll"]
