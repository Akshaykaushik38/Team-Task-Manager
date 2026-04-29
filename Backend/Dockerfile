FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["TaskManager.API.csproj", "./"]
RUN dotnet restore "TaskManager.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "TaskManager.API.csproj" -c Release -o /app/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port and start the app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TaskManager.API.dll"]
