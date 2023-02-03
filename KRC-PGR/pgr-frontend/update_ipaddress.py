import subprocess
# a = subprocess.call('ipconfig', shell=True, stdout=subprocess.PIPE , stderr=subprocess.PIPE ,encoding='utf-8')
output = subprocess.run('ipconfig', encoding='sjis', stdout=subprocess.PIPE)
# print('===============================================')
# print(output.stdout)
rows = output.stdout.replace(' ', '').split('\n')
# print(rows)

ipv4 = 'localhost'

for i in rows[::-1]:
    if i.startswith('IPv4アドレス'):
        ipv4 = i.split(':')[1]
        break

import json
read_file = open('./package.json', 'r')
dic = json.load(read_file)
dic['proxy'] = f'http://{ipv4}:8080'

write_file = open('./package.json', 'w')

json.dump(dic, write_file, indent=4)

with open('./node_modules/react-scripts/scripts/start.js', mode='r') as file:
    rows = file.readlines()

rows[138] = f"      openBrowser('http://{ipv4}:3000');\n"
# print(rows[138])

with open('./node_modules/react-scripts/scripts/start.js', mode='w') as file:
    file.writelines(rows)

# frontend\node_modules\react-scripts\scripts\start.js
