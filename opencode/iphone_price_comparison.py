import matplotlib.pyplot as plt
import numpy as np

# iPhone price comparison data
models = ['iPhone 16 (128GB)', 'iPhone 15 (128GB)', 'iPhone 16 (256GB)']
amazon_prices = [64900, None, None]
flipkart_prices = [69900, 59900, 79900]

x = np.arange(len(models))
width = 0.35

fig, ax = plt.subplots(figsize=(12, 8))

# Create bars for each platform (only where prices exist)
bars1_data = [p if p is not None else 0 for p in amazon_prices]
bars1 = ax.bar(x - width/2, bars1_data, width, label='Amazon', color='#FF9900', edgecolor='black')
bars2 = ax.bar(x + width/2, flipkart_prices, width, label='Flipkart', color='#2874F1', edgecolor='black')

# Add labels and title
ax.set_ylabel('Price (₹)', fontsize=14)
ax.set_xlabel('iPhone Model', fontsize=14)
ax.set_title('iPhone Price Comparison: Amazon vs Flipkart', fontsize=16, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(models, fontsize=12)
ax.legend(fontsize=12)

# Add value labels on bars
for i, (amz, flp) in enumerate(zip(amazon_prices, flipkart_prices)):
    # Amazon label
    if amz is not None:
        ax.annotate(f'₹{amz:,}',
                   xy=(x[i] - width/2, amz),
                   xytext=(0, 3),
                   textcoords="offset points",
                   ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    # Flipkart label
    ax.annotate(f'₹{flp:,}',
               xy=(x[i] + width/2, flp),
               xytext=(0, 3),
               textcoords="offset points",
               ha='center', va='bottom', fontsize=11, fontweight='bold')

# Add price difference annotation for iPhone 16 (128GB)
diff = flipkart_prices[0] - amazon_prices[0]
ax.annotate(f'Flipkart +₹{diff:,}',
            xy=(0, max(amazon_prices[0], flipkart_prices[0]) + 3000),
            ha='center', fontsize=10, color='red', fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='red'))

# Add grid
ax.yaxis.grid(True, linestyle='--', alpha=0.7)
ax.set_axisbelow(True)
ax.set_facecolor('#f5f5f5')

plt.tight_layout()
plt.savefig('iphone_price_comparison.png', dpi=300, bbox_inches='tight')
print("✅ Graph saved as 'iphone_price_comparison.png'")

# Create additional histogram for all Amazon prices
fig2, ax2 = plt.subplots(figsize=(14, 8))

all_models = ['iPhone 16\n(128GB)', 'iPhone 15\n(256GB)', 'iPhone 16 Pro Max\n(1TB)', 'iPhone 16 Plus\n(128GB)', 'iPhone Air\n(256GB)', 'iPhone Air\n(512GB)']
all_amazon = [64900, 63999, 174900, 74900, 92499, 112499]

colors = plt.cm.Oranges(np.linspace(0.3, 0.8, len(all_models)))

bars = ax2.bar(all_models, all_amazon, color=colors, edgecolor='black', linewidth=1.5)

# Add value labels
for bar, price in zip(bars, all_amazon):
    height = bar.get_height()
    ax2.annotate(f'₹{price:,}',
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3),
                textcoords="offset points",
                ha='center', va='bottom', fontsize=10, fontweight='bold')

ax2.set_ylabel('Price (₹)', fontsize=14)
ax2.set_xlabel('iPhone Model', fontsize=14)
ax2.set_title('Amazon iPhone Price Distribution', fontsize=16, fontweight='bold')
ax2.yaxis.grid(True, linestyle='--', alpha=0.7)
ax2.set_axisbelow(True)
ax2.set_facecolor('#f5f5f5')

plt.tight_layout()
plt.savefig('amazon_iphone_prices.png', dpi=300, bbox_inches='tight')
print("✅ Histogram saved as 'amazon_iphone_prices.png'")

# Create Flipkart histogram
fig3, ax3 = plt.subplots(figsize=(14, 8))

flipkart_models = ['iPhone 16\n(128GB)', 'iPhone 15\n(128GB)', 'iPhone 16\n(256GB)', 'iPhone 17\n(256GB)']
flipkart_prices_list = [69900, 59900, 79900, 82900]

colors_fk = plt.cm.Blues(np.linspace(0.3, 0.8, len(flipkart_models)))

bars3 = ax3.bar(flipkart_models, flipkart_prices_list, color=colors_fk, edgecolor='black', linewidth=1.5)

# Add value labels
for bar, price in zip(bars3, flipkart_prices_list):
    height = bar.get_height()
    ax3.annotate(f'₹{price:,}',
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3),
                textcoords="offset points",
                ha='center', va='bottom', fontsize=10, fontweight='bold')

ax3.set_ylabel('Price (₹)', fontsize=14)
ax3.set_xlabel('iPhone Model', fontsize=14)
ax3.set_title('Flipkart iPhone Price Distribution', fontsize=16, fontweight='bold')
ax3.yaxis.grid(True, linestyle='--', alpha=0.7)
ax3.set_axisbelow(True)
ax3.set_facecolor('#f5f5f5')

plt.tight_layout()
plt.savefig('flipkart_iphone_prices.png', dpi=300, bbox_inches='tight')
print("✅ Histogram saved as 'flipkart_iphone_prices.png'")

print("\n🎉 All graphs generated successfully!")
