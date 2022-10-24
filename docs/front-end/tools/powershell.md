## powershell

PowerShell因为是基于`.NET`面向对象的,而且本身就内置了非常多的命令。使得它不管从功能上还是性能上都要比CMD要强大得多。

可以这么说，CMD能办的事,PowerShell基本都就能办，但PowerShell能办的事,CMD遥不可及。





## curl

curl在powershell中只是一个别名，是Invoke-WebRequest的alias。所以可以参考文档来使用。

> [Invoke-WebRequest使用文档](https://learn.microsoft.com/zh-cn/previous-versions/powershell/module/Microsoft.PowerShell.Utility/Invoke-WebRequest?view=powershell-3.0)

### 常见用法

```bash
#请求地址
- Uri $uri
#添加header
-Headers @{"content-type"="application/json";"authorization"="bearer token"}
#指定Method
-Method Get
#将获取到的content输出到文件
-OutFile 'c:\Users\rmiao\temp\content.txt'
```

### GET

```bash
curl -URI http://www.bing.com?q=1
```

### POST

```bash
$uri = 'https://www.pstips.net/restapi/v2'
 
$hash = @{ name = "$name";
           pwd = "$passwd";
        }
$headers = @{"accept"="application/json"}
$JSON = $hash | convertto-json

# 这里最终执行POST请求
curl -uri $uri -Method POST -Body $JSON
```

### 将content内容输出到文本中

```bash
curl -h $header -uri $uri -method post -body $json -outfile "d:\content.txt"
```



### 请求头增加token

```bash
$data.token ="Bearer "+ $data.token
$heads = @{"authorization"=$data.token}
$uri="http://localhost:8001/api/needTokenAPI"

#发起请求
curl -h $heads -uri $uri | select -ExpandProperty content

#返回的结果
[{"children":[],"name":"全部"]
```



