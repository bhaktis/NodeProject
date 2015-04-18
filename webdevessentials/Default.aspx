<%@ Page Language="C#" %>

<script runat="server">
    <%-- This demo page has no server side script --%>
</script>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset='utf-8' />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Demo Home Page</title>

    <style type="text/css" media="screen">
        ul.master_navigation {
            font-size: 100%;
            height:10%;
            font-weight: bold;
            text-align: center;
            list-style: none;
            margin: 0.5em 0;
            padding: 0;
            border-bottom: solid rgb(128, 128, 128) 2px;
        }

            ul.master_navigation li {
                display: inline-block;
                padding: 0 0.5%;
            }

        a {
            color: whitesmoke;
            font-weight: bold;
            text-decoration: none;
        }

            a:visited {
                color: aqua;
            }

            a:hover {
                color: darkblue;
            }

        p {
            text-align: justify;
        }

        html { 
			background: url(images/background9.jpg) no-repeat center center fixed; 
			-webkit-background-size: cover;
			-moz-background-size: cover;
			-o-background-size: cover;
			background-size: cover;
		}      

        a {
            display: inline-block;
            vertical-align: middle;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            box-shadow: 0 0 1px rgba(0, 0, 0, 0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -moz-osx-font-smoothing: grayscale;
            -webkit-transition-duration: 0.5s;
            transition-duration: 0.5s;
        }

            a:hover, a:focus, a:active {
                -webkit-transform: scale(1.2);
                transform: scale(1.2);
                -webkit-transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
                transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
            }



        .pic {
            float: left;
            // align-content:center;
            width: 25%;
            height: 10%;
            border-width: 10px;
            border-color: darkblue;
          
        }

        .img {
            position: absolute;
            width: 100%;
        }

        .content {
            float: right;
            height: 40%;
            display: inline-block;
            color: aliceblue;      }

        .pad {
            padding: 10px;
        }
    </style>

</head>

<body>
    <div id="background"></div>
    <div class="pad">
        <form id="form1" runat="server">

            <div>
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
                </div>


                <div class="content">

                    <img src="images/myimage.jpg" class="pic" />
                    <h1>Bhakti Sanglikar</h1>
                    <h2>Web Development - CS 5610 course</h2>
                    <h3>College of Computer and Information Science</h3>
                    <p>
                        Hi. I am student of Masters of Computer Science at Northeastern university. 
                    This is my web development site where I'll be hosting projects and experiments.
                    </p>

                </div>

                <hr />
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
                    
                </ul>

                    </div>
                <ul class="master_navigation">
	<li>
		<a href="https://www.linkedin.com/pub/bhaktisanglikar">			
				<img src="images/linkedin.png"  alt="LinkedIn">						
		</a>
	</li>
	<li>
		<a href="https://www.facebook.com/bhakti.sanglikar">			
				<img src="images/facebook.png"  alt="Facebook">						
		</a></li>
                    <li>
                        <a href="https://github.com/bhaktis/Web-development-CS5610" target="_blank">
                            <img src="images/git.png"  alt="Github">	
                        </a>
                    </li>	
</ul>

            </div>

        </form>

    </div>

</body>
</html>
