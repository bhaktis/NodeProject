<%@ Page Language="C#" %>

<script runat="server">
    <%-- This demo page has no server side script --%>
</script>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset='utf-8' />

    <title>Demo Home Page</title>

    <style type="text/css">
        ul.master_navigation {
            font-size: 100%;
            font-weight: bold;
            text-align: center;
            list-style: none;
            margin: 0.5em 0;
            padding: 0;
        }

            ul.master_navigation li {
                display: inline-block;
                padding: 0 0.5%;
            }

        a {
            color: #08f;
            font-weight: bold;
            text-decoration: none;
        }

            a:visited {
                color: #88f;
            }

            a:hover {
                color: #f00;
            }

        p {
            text-align: justify;
        }
    </style>

    <style type="text/css" media="screen">
        body {
            align-content:center;
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            background-color: #808080;
        }

        .pic {
            float: right;
            width: 25%;
            height: 25%;
        }

        .content {
            float: right;
            height:40%;
        }

        .pad {
            padding: 10px;
        }
    </style>

</head>

<body>
    <div class="pad">
        <form id="form1" runat="server">

            <div>
                <ul class="master_navigation">
                    <li><a href="sitestatistics/" target="_blank">SiteStatistics</a></li>
                    <li><a href="statistics/" target="_blank">Statistics</a></li>
                    <li><a href="source/" target="_blank">Source</a></li>
                    <li><a href="search/" target="_blank">Search</a></li>
                    <li><a href="searchtree/" target="_blank">SearchTree</a></li>
                    <li><a href="textview/" target="_blank">TextView</a></li>
                    <li><a href="filelist.aspx" target="_blank">FileList</a></li>
                    <li><a href="autofile.aspx" target="_blank">AutoFile</a></li>
                    <li><a href="images/autoimage.aspx" target="_blank">Images</a></li>
                    <li><a href="blog/" target="_blank">Blog</a></li>

                </ul>

                <hr />
                <div class="content">
                    <img src="images/myimage.jpg" class="pic" width="150" height="150" />
                    <h1>Bhakti Sanglikar</h1>
                    <h2>Web Development - CS 5610 course</h2>
                    <h3>College of Computer and Information Science</h3>
                    <p>
                        Hi. I am student of Masters of Computer Science at Northeastern university. 
                    This is my web development site where I'll be hosting projects and experiments.
                    </p>
                    
                </div>
                
                <div>
                    <ul class="master_navigation">
                        <li><a href="http://www.northeastern.edu/rasala/webstories.htm"
                            target="_blank">Web Development Stories</a></li>
                        <li>
                            <a href="story/index.htm" target="_blank">Story Utility</a>
                        </li>
                        <li>
                            <a href="story/index.htm?../experiments/story.txt">Experiments</a>
                        </li>
                        <li>
                            <a href="https://github.com/bhaktis/Web-development-CS5610" target="_blank">GitHub</a>
                        </li>
                    </ul>

                </div>

            </div>

        </form>

    </div>

</body>
</html>
