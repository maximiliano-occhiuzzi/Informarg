<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<form class="form-crear-rodado" action="<%= request.getContextPath() %>/crearRodado" method="post">
    
    <!-- Campo Patente (Texto) -->
    <div class="form-group mb-3">
        <label for="patente">Patente</label>
        <input type="text" class="form-control" id="patente" name="patente" required>
    </div>

    <!-- Campo Chasis (Texto) -->
    <div class="form-group mb-3">
        <label for="chasis">Número de Chasis</label>
        <input type="text" class="form-control" id="chasis" name="chasis" required>
    </div>

    <!-- Campo Color (Texto) -->
    <div class="form-group mb-3">
        <label for="color">Color</label>
        <input type="text" class="form-control" id="color" name="color">
    </div>

    <!-- Campo Caja (Enum) -->
    <div class="form-group mb-3">
        <label for="caja">Tipo de Caja</label>
        <select class="form-control" id="caja" name="caja">
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATICO">Automática</option>
        </select>
    </div>

    <!-- Campo Motor (Enum) -->
    <div class="form-group mb-3">
        <label for="motor">Motor</label>
        <select class="form-control" id="motor" name="motor">
            <option value="DIESEL">diesel</option>
            <option value="HIBRIDO">Híbrido</option>
            <option value="ELECTRICO">Eléctrico</option>
        </select>
    </div>

    <!-- Campo Estado (Enum) -->
    <div class="form-group mb-3">
        <label for="TipoEstado">Estado del Vehículo</label>
        <select class="form-control" id="TipoEstado" name="TipoEstado">
            <option value="NUEVO">Nuevo</option>
            <option value="USADO">Usado</option>
        </select>
    </div>

    <!-- Campo Consumo (Enum) -->
    <div class="form-group mb-3">
        <label for="TipoConsumo">Tipo de Consumo</label>
        <select class="form-control" id="TipoConsumo" name="TipoConsumo">
            <option value="BAJO">Bajo</option>
            <option value="MEDIO">Medio</option>
            <option value="ALTO">Alto</option>
        </select>
    </div>

    <!-- Campo Puertas (Enum) -->
    <div class="form-group mb-3">
        <label for="puertas">Cantidad de Puertas</label>
        <select class="form-control" id="puertas" name="puertas">
            <option value="DOS">2 Puertas</option>
            <option value="TRES">3 Puertas</option>
            <option value="CUATRO">4 Puertas</option>
            <option value="CINCO">5 Puertas</option>
        </select>
    </div>

    <!-- Campo Tipo de Rodado (Enum) -->
    <div class="form-group mb-3">
        <label for="TipoRodado">Categoría de Rodado</label>
        <select class="form-control" id="TipoRodado" name="TipoRodado">
            <option value="AUTO">Auto</option>
            <option value="CAMIONETA">Camioneta</option>
            <option value="MOTO">Moto</option>
        </select>
    </div>

    <button type="submit" class="btn btn-primary mt-3">Guardar Rodado</button>
    <% if ("success".equals(request.getParameter("status"))) { %>
    <div class="alert alert-success">¡Rodado guardado con éxito en la base de datos!</div>
<% } else if ("error".equals(request.getParameter("status"))) { %>
    <div class="alert alert-danger">Hubo un error al guardar. Revisa la consola.</div>
<% } %>
</form>
</body>
</html>