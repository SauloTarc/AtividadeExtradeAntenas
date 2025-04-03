import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import dblquad

# Definição da função F(theta, phi) para o padrão de radiação
def F(theta, phi):
    return np.abs(np.cos(theta)**2 + np.sin(2*phi))

# Resolução angular para os cálculos
theta_vals = np.linspace(0, np.pi, 200)  # De 0 a π
phi_vals = np.linspace(0, 2*np.pi, 200)  # De 0 a 2π
Theta, Phi = np.meshgrid(theta_vals, phi_vals)
intensidade = F(Theta, Phi)

# Cálculo da diretividade máxima
integral, _ = dblquad(
    lambda t, p: F(t, p) * np.sin(t),
    0, 2*np.pi,  
    lambda p: 0, lambda p: np.pi  
)
diretividade_maxima = (4 * np.pi) / (integral / np.max(intensidade))

# Encontrando a direção da máxima intensidade
indice_maximo = np.argmax(intensidade)
theta_maximo = theta_vals[indice_maximo % len(theta_vals)]
phi_maximo = phi_vals[indice_maximo // len(theta_vals)]

# Exibição dos resultados numéricos
print(f"Diretividade Máxima: {diretividade_maxima:.2f}")
print(f"Ângulo de Máxima Intensidade (θ): {np.degrees(theta_maximo):.2f}°")
print(f"Phi de Máxima Intensidade (φ): {np.degrees(phi_maximo):.2f}°")

# --- GERANDO O GRÁFICO POLAR ---
fig, ax = plt.subplots(subplot_kw={'projection': 'polar'}, figsize=(7, 7))

# Normalizando e plotando a intensidade no gráfico polar
intensidade_normalizada = np.max(intensidade, axis=0) / np.max(intensidade)
ax.plot(theta_vals, intensidade_normalizada, 'b', linewidth=2, label="Padrão de Radiação")

# Destacando a máxima intensidade
ax.plot([theta_maximo, theta_maximo], [0, 1], linestyle='--', color='r', label=f"Máx. em {np.degrees(theta_maximo):.1f}°")

# Adicionando texto com diretividade e ângulo máximo
texto = f"Dir. Máx: {diretividade_maxima:.2f}\nθ Máx: {np.degrees(theta_maximo):.1f}°\nφ Máx: {np.degrees(phi_maximo):.1f}°"
ax.text(0.05, 0.85, texto, transform=ax.transAxes, fontsize=12, bbox=dict(facecolor='white', alpha=0.7))

# Configurações do gráfico
ax.set_theta_zero_location('N')  # Zero graus no topo
ax.set_theta_direction(-1)  # Sentido horário
ax.set_xticks(np.linspace(0, np.pi, 5))
ax.set_xticklabels(["0°", "45°", "90°", "135°", "180°"])
ax.set_yticklabels([])  # Remove rótulos da intensidade para um visual mais limpo
ax.set_title("Diagrama de Radiação (Polar)")
ax.legend()

# Exibir gráfico
plt.show()